import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('checkin')
  @ApiOperation({ summary: 'Check-in an employee within allowed location' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string', example: '671b3a2d9f9d1f64b3d1f999' },
        lat: { type: 'number', example: 29.49120 },
        lng: { type: 'number', example: 34.90093 },
      },
      required: ['employeeId', 'lat', 'lng'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Employee checked in successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Already checked in or outside allowed area.',
  })
  async checkIn(@Body() body: { employeeId: string; lat: number; lng: number }) {
    const { employeeId, lat, lng } = body;
    if (!employeeId || lat == null || lng == null)
      throw new BadRequestException('employeeId, lat and lng are required.');
    return this.attendanceService.checkIn(employeeId, lat, lng);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Check-out an employee within allowed location' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        employeeId: { type: 'string', example: '671b3a2d9f9d1f64b3d1f999' },
        lat: { type: 'number', example: 29.49119 },
        lng: { type: 'number', example: 34.90095 },
      },
      required: ['employeeId', 'lat', 'lng'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Employee checked out successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'No active check-in or outside allowed area.',
  })
  async checkOut(@Body() body: { employeeId: string; lat: number; lng: number }) {
    const { employeeId, lat, lng } = body;
    if (!employeeId || lat == null || lng == null)
      throw new BadRequestException('employeeId, lat and lng are required.');
    return this.attendanceService.checkOut(employeeId, lat, lng);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today’s attendance for an employee' })
  @ApiQuery({
    name: 'employeeId',
    required: true,
    description: 'Employee ID',
    example: '671b3a2d9f9d1f64b3d1f999',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance record for today.',
  })
  async today() {
   
    return this.attendanceService.getTodayAttendance();
  }

  @Get('by-date')
@ApiOperation({ summary: 'Get attendance by specific date' })
@ApiQuery({
  name: 'date',
  required: true,
  example: '2025-10-05',
})
@ApiQuery({
  name: 'name',
  required: false,
  example: 'Mostafa',
})
async getByDate(
  @Query('date') date: string,
  @Query('name') name?: string,
) {
  return this.attendanceService.getAttendanceByDate(date, name);
}


  @Get('current-month')
  @ApiOperation({
    summary: 'Get attendance for the current month (optional filters)',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by employee name (partial match)',
    example: 'Mostafa',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Filter by employee phone (partial match)',
    example: '0101',
  })
  @ApiResponse({
    status: 200,
    description: 'List of attendance records for the current month.',
  })
  async getCurrentMonth(
    @Query('name') name?: string,
    @Query('phone') phone?: string,
  ) {
    return this.attendanceService.getCurrentMonthAttendance(name, phone);
  }

  @Get('by-month')
  @ApiOperation({
    summary: 'Get attendance by specific month and year (optional filters)',
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month number (1-12)',
    example: 10,
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year (e.g., 2025)',
    example: 2025,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by employee name (partial match)',
    example: 'Ali',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Filter by employee phone (partial match)',
    example: '0100',
  })
  @ApiResponse({
    status: 200,
    description: 'List of attendance records for given month/year.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or missing month/year parameters.',
  })
  async getByMonth(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
  ) {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (!monthNum || !yearNum) {
      throw new BadRequestException('Please provide valid month and year.');
    }

    return this.attendanceService.getAttendanceByMonthAndYear(
      yearNum,
      monthNum,
      name,
      phone,
    );
  }
}
