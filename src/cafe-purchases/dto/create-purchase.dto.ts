import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsMongoId } from "class-validator";

export class CreateCafePurchaseDto {
  @ApiProperty({ example: "652c1f4e97bca41bcd22e111" })
  @IsMongoId()
  @IsNotEmpty()
  cafeId: string;

  @ApiProperty({ example: "652c1f4e97bca41bcd22e222", required: false })
  @IsMongoId()
  category?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 155 })
  @IsNumber()
  totalCost: number;
}
