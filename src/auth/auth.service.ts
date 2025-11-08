import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Employees,
  EmployeesDocument,
} from 'src/employees/schema/employee.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Employees.name)
    private employeeModel: Model<EmployeesDocument>,
    private jwtService: JwtService,
  ) {}

  async login(phone: string, password?: string) {
    const employee = await this.employeeModel.findOne({ phone });
    if (!employee) throw new UnauthorizedException('رقم الهاتف غير مسجل');

    if (employee.firstLogin) {
      return {
        firstLogin: true,
        message: 'أول تسجيل دخول، أنشئ كلمة مرور جديدة',
      };
    }
    if (password) {
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) throw new UnauthorizedException('كلمة المرور غير صحيحة');
    }

    const token = this.jwtService.sign({
      id: employee._id,
      role: employee.role,
    });
    return { token, employee };
    
  }

  async setPassword(phone: string, newPassword: string) {
    const employee = await this.employeeModel.findOne({ phone });
    if (!employee) throw new BadRequestException('الموظف غير موجود');

    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(newPassword, salt);
    employee.firstLogin = false;
    await employee.save();

    const token = this.jwtService.sign({
      id: employee._id,
      role: employee.role,
    });
    return { message: 'تم تعيين كلمة المرور بنجاح', token };
  }
}
