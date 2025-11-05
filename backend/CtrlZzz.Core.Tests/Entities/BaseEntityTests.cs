using CtrlZzz.Core.Entities;
using FluentAssertions;
using Xunit;

namespace CtrlZzz.Core.Tests.Entities;

public class BaseEntityTests
{
    // Placeholder test - will add real tests when we have business logic
    [Fact]
    public void BaseEntity_ShouldHaveId()
    {
        // Arrange
        var entity = new TestEntity();

        // Act
        entity.Id = Guid.NewGuid();

        // Assert
        entity.Id.Should().NotBeEmpty();
    }

    [Fact]
    public void BaseEntity_ShouldHaveCreatedAt()
    {
        // Arrange
        var entity = new TestEntity();
        var now = DateTime.UtcNow;

        // Act
        entity.CreatedAt = now;

        // Assert
        entity.CreatedAt.Should().Be(now);
    }

    [Fact]
    public void BaseEntity_ShouldHaveIsDeletedFlag()
    {
        // Arrange
        var entity = new TestEntity();

        // Act
        entity.IsDeleted = true;

        // Assert
        entity.IsDeleted.Should().BeTrue();
    }

    // Test entity for testing BaseEntity
    private class TestEntity : BaseEntity
    {
    }
}
