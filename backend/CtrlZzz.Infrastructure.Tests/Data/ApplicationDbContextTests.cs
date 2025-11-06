using CtrlZzz.Core.Entities;
using CtrlZzz.Infrastructure.Data;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CtrlZzz.Infrastructure.Tests.Data;

public class ApplicationDbContextTests
{
    // Placeholder test - will add real tests when we have repositories
    [Fact]
    public void ApplicationDbContext_ShouldHaveUsersDbSet()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        // Act
        using var context = new ApplicationDbContext(options);

        // Assert
        context.Users.Should().NotBeNull();
    }

    [Fact]
    public void ApplicationDbContext_ShouldHaveProjectsDbSet()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb2")
            .Options;

        // Act
        using var context = new ApplicationDbContext(options);

        // Assert
        context.Projects.Should().NotBeNull();
    }

    [Fact]
    public void ApplicationDbContext_ShouldHaveWorkItemsDbSet()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb3")
            .Options;

        // Act
        using var context = new ApplicationDbContext(options);

        // Assert
        context.WorkItems.Should().NotBeNull();
    }
}
