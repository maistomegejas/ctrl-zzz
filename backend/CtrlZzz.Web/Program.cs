var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3001")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Dice roll endpoint
app.MapGet("/api/dice", () =>
{
    var random = new Random();
    var roll = random.Next(1, 7); // 1-6
    return Results.Ok(new { roll, timestamp = DateTime.UtcNow });
});

app.Run();
