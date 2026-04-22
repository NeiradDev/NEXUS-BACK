import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FilterUserDto } from './dto/filter-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  //CREAR USUARIO
  async create(createUserDto: CreateUserDto) {
    const existingCedula = await this.usersRepository.findOne({
      where: { cedula: createUserDto.cedula },
      select: ['cedula'],
    });

    if (existingCedula) {
      throw new ConflictException('Ya existe un usuario con esa cédula');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      activo: createUserDto.activo ?? true,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.findOne(savedUser.id_user);
    
  }
  //CREAR VARIOS USUARIOS
async createMany(createUserDtos: CreateUserDto[]) {
  if (!createUserDtos || createUserDtos.length === 0) {
    throw new BadRequestException('Debe enviar al menos un usuario');
  }

  const normalizedDtos = createUserDtos.map((dto) => ({
    ...dto,
    nombres: dto.nombres?.trim(),
    apellidos: dto.apellidos?.trim(),
    cedula: dto.cedula?.trim(),
    correo: dto.correo?.trim(),
    telefono: dto.telefono?.trim(),
    activo: dto.activo ?? true,
  }));

  const cedulas = normalizedDtos.map((u) => u.cedula);

  const duplicatedCedulasInRequest = cedulas.filter(
    (cedula, index) => cedulas.indexOf(cedula) !== index,
  );

  if (duplicatedCedulasInRequest.length > 0) {
    const unicas = [...new Set(duplicatedCedulasInRequest)];
    throw new ConflictException(
      `Hay cédulas duplicadas en la petición: ${unicas.join(', ')}`,
    );
  }

  const existingUsers = await this.usersRepository.find({
    where: { cedula: In(cedulas) },
    select: ['id_user', 'cedula'],
  });

  if (existingUsers.length > 0) {
    throw new ConflictException(
      `Ya existen usuarios con estas cédulas: ${existingUsers
        .map((u) => u.cedula)
        .join(', ')}`,
    );
  }

  const usersToSave = await Promise.all(
    normalizedDtos.map(async (dto) => {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return this.usersRepository.create({
        ...dto,
        password: hashedPassword,
      });
    }),
  );

  const savedUsers = await this.usersRepository.save(usersToSave);

  return savedUsers.map(({ password, ...user }) => user);
}

  async findAll(filters: FilterUserDto) {
  const where =
    typeof filters.activo === 'boolean'
      ? { activo: filters.activo }
      : {};

  return this.usersRepository.find({
    where,
    order: { id_user: 'ASC' },
  });
}

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException(`No existe el usuario con id ${id}`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  await this.findOne(id);

  if (updateUserDto.cedula) {
    const userWithCedula = await this.usersRepository.findOne({
      where: { cedula: updateUserDto.cedula },
      select: ['id_user', 'cedula'],
    });

    if (userWithCedula && userWithCedula.id_user !== id) {
      throw new ConflictException('Ya existe otro usuario con esa cédula');
    }
  }

  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  await this.usersRepository.update({ id_user: id }, updateUserDto);

  return this.findOne(id);
}

  async remove(id: number) {
    const user = await this.findOne(id);
    user.activo = false;
    await this.usersRepository.save(user);

    return {
      message: 'Usuario desactivado correctamente',
    };
  }
}
