import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmpRevenue, EmpRevenueDocument } from '../emp-revenue/schema/revenue.schema';
import { Employees, EmployeesDocument } from '../employees/schema/employee.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(EmpRevenue.name)
    private readonly revenueModel: Model<EmpRevenueDocument>,

    @InjectModel(Employees.name)
    private readonly employeeModel: Model<EmployeesDocument>,
  ) {}

  async getDashboardInsights() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 1️⃣ - Filter revenues for the current month only
    const revenues = await this.revenueModel
      .find({ date: { $gte: startOfMonth, $lte: endOfMonth } })
      .populate('activity')
      .populate('employee');

    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

    // Revenue per activity
    const revenuePerActivity = revenues.reduce((acc, r:any) => {
      const name = r.activity?.name || 'غير محدد';
      acc[name] = (acc[name] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

    // Revenue by employee
    const revenueByEmployee = revenues.reduce((acc, r:any) => {
      const emp = r.employee?.name || 'موظف غير معروف';
      acc[emp] = (acc[emp] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

    const topEmployees = Object.entries(revenueByEmployee)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, total]) => ({ name, totalRevenue: total }));

    return {
      totalRevenue,
      activityRevenue: Object.entries(revenuePerActivity).map(([activity, total]) => ({
        activity,
        total,
      })),
      topEmployees,
    };
  }
}
