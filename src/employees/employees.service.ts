import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Employees, EmployeesDocument } from './schema/employee.schema';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employees> {
    const newEmployee = new this.employeeModel(createEmployeeDto);
    return newEmployee.save();
  }

  async findAll(filters: Record<string, any>): Promise<Employees[]> {
    const query: FilterQuery<EmployeesDocument> = {};

    if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
    if (filters.phone) query.phone = { $regex: filters.phone, $options: 'i' };
    if (filters.nationalId) query.nationalId = { $regex: filters.nationalId, $options: 'i' };
    if (filters.email) query.email = { $regex: filters.email, $options: 'i' };
    if (filters.address) query.address = { $regex: filters.address, $options: 'i' };

    // Filter by date range if provided
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    return this.employeeModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Employees> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) throw new NotFoundException(`Employee with ID ${id} not found`);
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employees> {
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();

    if (!updatedEmployee) throw new NotFoundException(`Employee with ID ${id} not found`);
    return updatedEmployee;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Employee with ID ${id} not found`);
    return { message: 'Employee deleted successfully' };
  }
}
