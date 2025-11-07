using CtrlZzz.Core.Interfaces;
using CtrlZzz.Infrastructure.Data;
using CtrlZzz.Infrastructure.Repositories;
using CtrlZzz.Infrastructure.Services;
using CtrlZzz.Web.Authorization;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("CtrlZzz.Infrastructure")));

// Add MediatR
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(CtrlZzz.Core.Entities.BaseEntity).Assembly);
});

// Add FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(CtrlZzz.Core.Entities.BaseEntity).Assembly);

// Add Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Add services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();

// Add JWT Authentication
var jwtKey = builder.Configuration["JwtSettings:SecretKey"] ?? "your-super-secret-key-change-this-in-production-min-32-chars";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "CtrlZzz";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "CtrlZzz";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Add custom authorization with permission-based policies
builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3001", "http://localhost:3002")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Always enable Swagger (for development convenience)
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Health check endpoint
app.MapGet("/api/health", () => new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
}).WithTags("Health");

app.MapControllers();

app.Run();
