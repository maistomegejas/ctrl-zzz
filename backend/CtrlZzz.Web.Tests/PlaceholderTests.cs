using FluentAssertions;
using Xunit;

namespace CtrlZzz.Web.Tests;

public class PlaceholderTests
{
    // Placeholder test - will add integration tests when we have API endpoints
    [Fact]
    public void Placeholder_ShouldPass()
    {
        // Arrange
        var expected = true;

        // Act
        var actual = true;

        // Assert
        actual.Should().Be(expected);
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(2, 2, 4)]
    [InlineData(5, 3, 8)]
    public void Placeholder_TheoryTest_ShouldWork(int a, int b, int expected)
    {
        // Arrange & Act
        var result = a + b;

        // Assert
        result.Should().Be(expected);
    }
}
