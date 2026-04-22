import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(1, 64)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(1, 64)
  apellidos!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Matches(/^\d{10}$/, {
    message: 'La cédula debe contener exactamente 10 dígitos numéricos',
  })
  cedula!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_agencias?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_cargo?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_supervisor?: number;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(1, 120)
  correo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Length(1, 20)
  telefono?: string;
}