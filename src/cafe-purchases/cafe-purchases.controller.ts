import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CreateCafePurchaseDto } from "./dto/create-purchase.dto";
import { UpdateCafePurchaseDto } from "./dto/update-purchase.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { CafePurchaseService } from "./cafe-purchases.service";

@ApiTags("Cafe Purchases")
@Controller("purchases")
export class CafePurchaseController {
  constructor(private readonly purchaseService: CafePurchaseService) {}


  @Post()
  @ApiOperation({ summary: "Create a new cafe purchase record" })
  @ApiResponse({ status: 201, description: "Created successfully" })
  create(@Body() dto: CreateCafePurchaseDto) {
    return this.purchaseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all cafe purchase records" })
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific purchase record by ID" })
  @ApiParam({ name: "id" })
  findOne(@Param("id") id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a purchase record" })
  @ApiParam({ name: "id" })
  update(@Param("id") id: string, @Body() dto: UpdateCafePurchaseDto) {
    return this.purchaseService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a purchase record" })
  @ApiParam({ name: "id" })
  remove(@Param("id") id: string) {
    return this.purchaseService.remove(id);
  }
}
