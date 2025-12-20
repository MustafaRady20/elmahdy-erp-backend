import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Employees, EmployeesDocument } from './schema/employee.schema';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employees.name)
    private employeeModel: Model<EmployeesDocument>,

    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  async create(
    dto: CreateEmployeeDto,
    files: {
      profileImage?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      militaryServiceCertificateImage?: Express.Multer.File[];
      permitImage?: Express.Multer.File[];
    },
  ): Promise<Employees> {
    const upload = async (file?: Express.Multer.File, folder?: string) => {
      if (!file) return undefined;
      const result: any = await this.cloudinaryService.uploadImage(
        file,
        folder,
      );
      return result.secure_url;
    };

    const employee = new this.employeeModel({
      ...dto,
      password: dto.phone,
      profileImage: await upload(files.profileImage?.[0], 'employees/profile'),
      nationalIdImage: await upload(
        files.nationalIdImage?.[0],
        'employees/national-id',
      ),
      militaryServiceCertificateImage: await upload(
        files.militaryServiceCertificateImage?.[0],
        'employees/military',
      ),
      permitInfo: {
        startDate: dto.permitStartDate,
        endDate: dto.permitEndDate,
        permitImage: await upload(files.permitImage?.[0], 'employees/permit'),
      },
    });

    return employee.save();
  }

  async findAll(filters: Record<string, any>): Promise<Employees[]> {
    const query: FilterQuery<EmployeesDocument> = {};

    if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
    if (filters.phone) query.phone = { $regex: filters.phone, $options: 'i' };
    if (filters.nationalId)
      query.nationalId = { $regex: filters.nationalId, $options: 'i' };
    if (filters.email) query.email = { $regex: filters.email, $options: 'i' };
    if (filters.address)
      query.address = { $regex: filters.address, $options: 'i' };

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    return this.employeeModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Employees> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee)
      throw new NotFoundException(`Employee with ID ${id} not found`);
    return employee;
  }

  async update(
    id: string,
    dto: UpdateEmployeeDto,
    files: {
      profileImage?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      militaryServiceCertificateImage?: Express.Multer.File[];
      permitImage?: Express.Multer.File[];
    },
  ): Promise<Employees> {
    const employee = await this.employeeModel.findById(id);
    if (!employee)
      throw new NotFoundException(`Employee with ID ${id} not found`);

    const upload = async (file?: Express.Multer.File, folder?: string) => {
      if (!file) return undefined;
      const result: any = await this.cloudinaryService.uploadImage(
        file,
        folder,
      );
      return result.secure_url;
    };

    Object.assign(employee, dto);

    if (files.profileImage?.[0]) {
      employee.profileImage = await upload(
        files.profileImage[0],
        'employees/profile',
      );
    }

    if (files.nationalIdImage?.[0]) {
      employee.nationalIdImage = await upload(
        files.nationalIdImage[0],
        'employees/national-id',
      );
    }

    if (files.militaryServiceCertificateImage?.[0]) {
      employee.militaryServiceCertificateImage = await upload(
        files.militaryServiceCertificateImage[0],
        'employees/military',
      );
    }

    if (files.permitImage?.[0]) {
      employee.permitInfo = {
        ...employee.permitInfo,
        permitImage: await upload(files.permitImage[0], 'employees/permit'),
      };
    }

    return employee.save();
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!result)
      throw new NotFoundException(`Employee with ID ${id} not found`);
    return { message: 'Employee deleted successfully' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async notifyPermitExpiry() {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const employees = await this.employeeModel.find({
      'permitInfo.endDate': {
        $gte: today,
        $lte: sevenDaysFromNow,
      },
      status: 'active',
    });

    for (const employee of employees) {
      if (!employee.email) continue;

      await this.mailService.sendPermitExpiryEmail(
        'Safwat22236@gmail.com',
        employee.name,
        employee.permitInfo?.endDate,
      );
    }

    console.log(
      `✅ Permit expiry check completed. Found ${employees.length} employees`,
    );
  }
}
