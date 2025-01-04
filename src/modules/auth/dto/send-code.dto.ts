import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class SendCodeDto {
  @IsNotEmpty()
  @IsMobilePhone("fa-IR")
  mobile: string;
  @IsOptional()
  @IsString()
  code: string;
}
