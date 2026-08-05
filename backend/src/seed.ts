import "reflect-metadata";
import bcrypt from "bcryptjs";
import { AppDataSource } from "./config/database";
import { User } from "./entities/User";
import { Department } from "./entities/Department";
import { Employee } from "./entities/Employee";
import { UserRole, EmployeeStatus } from "./types";

async function seed() {
  await AppDataSource.initialize();
  console.log("✅ Connected to database");

  const userRepo = AppDataSource.getRepository(User);
  const deptRepo = AppDataSource.getRepository(Department);
  const empRepo = AppDataSource.getRepository(Employee);

  // ── Departments ──────────────────────────────────────────
  const departments = await deptRepo.save([
    { name: "Engineering", description: "Software development team", location: "Floor 3" },
    { name: "Human Resources", description: "HR and recruitment", location: "Floor 1" },
    { name: "Finance", description: "Accounting and finance", location: "Floor 2" },
    { name: "Marketing", description: "Marketing and branding", location: "Floor 2" },
  ]);
  console.log("✅ Departments seeded");

  // ── Users + Employees ────────────────────────────────────
  const password = await bcrypt.hash("Password123!", 10);

  const usersData = [
    {
      email: "admin@company.com",
      firstName: "Admin",
      lastName: "System",
      role: UserRole.ADMIN,
      employeeCode: "EMP001",
      position: "System Administrator",
      salary: 50000000,
      department: departments[1], // HR
    },
    {
      email: "manager@company.com",
      firstName: "Nguyen",
      lastName: "Van A",
      role: UserRole.MANAGER,
      employeeCode: "EMP002",
      position: "Engineering Manager",
      salary: 45000000,
      department: departments[0], // Engineering
    },
    {
      email: "employee1@company.com",
      firstName: "Tran",
      lastName: "Thi B",
      role: UserRole.EMPLOYEE,
      employeeCode: "EMP003",
      position: "Frontend Developer",
      salary: 25000000,
      department: departments[0], // Engineering
    },
    {
      email: "employee2@company.com",
      firstName: "Le",
      lastName: "Van C",
      role: UserRole.EMPLOYEE,
      employeeCode: "EMP004",
      position: "Backend Developer",
      salary: 28000000,
      department: departments[0], // Engineering
    },
    {
      email: "finance@company.com",
      firstName: "Pham",
      lastName: "Thi D",
      role: UserRole.EMPLOYEE,
      employeeCode: "EMP005",
      position: "Financial Analyst",
      salary: 22000000,
      department: departments[2], // Finance
    },
  ];

  for (const data of usersData) {
    const user = userRepo.create({
      email: data.email,
      password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      isActive: true,
      isEmailVerified: true,
    });
    const savedUser = await userRepo.save(user);

    const employee = empRepo.create({
      employeeCode: data.employeeCode,
      position: data.position,
      salary: data.salary,
      dateOfBirth: new Date("1990-01-01"),
      hireDate: new Date("2023-01-01"),
      status: EmployeeStatus.ACTIVE,
      phone: "0901234567",
      address: "Ho Chi Minh City",
      user: savedUser,
      department: data.department,
    });
    await empRepo.save(employee);
  }

  console.log("✅ Users & Employees seeded");
  console.log("\n📋 Accounts to login:");
  console.log("  admin@company.com    / Password123! (Admin)");
  console.log("  manager@company.com  / Password123! (Manager)");
  console.log("  employee1@company.com / Password123! (Employee)");

  await AppDataSource.destroy();
  console.log("\n🎉 Seed completed!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
