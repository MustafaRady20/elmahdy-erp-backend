import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new employee with images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'nationalIdImage', maxCount: 1 },
      { name: 'militaryServiceCertificateImage', maxCount: 1 },
      { name: 'permitImage', maxCount: 1 },
    ]),
  )
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFiles()
    files: {
      profileImage?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      militaryServiceCertificateImage?: Express.Multer.File[];
      permitImage?: Express.Multer.File[];
    },
  ) {
    return this.employeesService.create(createEmployeeDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees (with filters)' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name' })
  @ApiQuery({ name: 'phone', required: false, description: 'Filter by phone' })
  @ApiQuery({
    name: 'nationalId',
    required: false,
    description: 'Filter by national ID',
  })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by email' })
  @ApiQuery({
    name: 'address',
    required: false,
    description: 'Filter by address',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Created after this date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Created before this date',
  })
  @ApiResponse({
    status: 200,
    description: 'List of employees returned successfully',
  })
  findAll(@Query() filters: Record<string, any>) {
    return this.employeesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Employee ID' })
  @ApiResponse({ status: 200, description: 'Employee details' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee with images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'nationalIdImage', maxCount: 1 },
      { name: 'militaryServiceCertificateImage', maxCount: 1 },
      { name: 'permitImage', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles()
    files: {
      profileImage?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      militaryServiceCertificateImage?: Express.Multer.File[];
      permitImage?: Express.Multer.File[];
    },
  ) {
    return this.employeesService.update(id, updateEmployeeDto, files);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete employee' })
  @ApiParam({ name: 'id', required: true, description: 'Employee ID' })
  @ApiResponse({ status: 204, description: 'Employee deleted successfully' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
