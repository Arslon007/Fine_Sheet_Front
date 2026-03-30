using Application.Interfaces;
using DataAccess.Persistence;
using Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Application.Services;

public class EmployeeService : IEmployeeService
{
    private readonly AppDbContext _db;

    public EmployeeService(AppDbContext context)
    {
        _db = context;
    }

    public List<Employee> GetAllEmployees() =>
        _db.Employee
            .Include(e => e.Fines)
            .Include(e => e.Bonuses)
            .OrderBy(e => e.Id)
            .ToList();

    public Employee? GetEmployeeById(int id) =>
        _db.Employee
            .Include(e => e.Fines)
            .Include(e => e.Bonuses)
            .FirstOrDefault(e => e.Id == id);

    public void AddEmployee(string fullName, string position, decimal salary)
    {
        var employee = new Employee
        {
            FullName = fullName,
            Position = position,
            Salary = salary
        };

        _db.Employee.Add(employee);
        _db.SaveChanges();
    }
}
