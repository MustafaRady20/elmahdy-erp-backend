import { PartialType } from "@nestjs/swagger";
import { CreateCafePurchaseDto } from "./create-purchase.dto";

export class UpdateCafePurchaseDto extends PartialType(CreateCafePurchaseDto) {}
