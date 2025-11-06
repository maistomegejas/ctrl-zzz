using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Sprints.Commands.CreateSprint;
using CtrlZzz.Core.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace CtrlZzz.Core.Tests.Features.Sprints;

public class CreateSprintHandlerTests
{
    private readonly Mock<IRepository<Sprint>> _sprintRepository;
    private readonly Mock<IRepository<Project>> _projectRepository;
    private readonly CreateSprintHandler _handler;

    public CreateSprintHandlerTests()
    {
        _sprintRepository = new Mock<IRepository<Sprint>>();
        _projectRepository = new Mock<IRepository<Project>>();
        _handler = new CreateSprintHandler(_sprintRepository.Object, _projectRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ShouldCreateSprint()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var command = new CreateSprintCommand("Sprint 1", "Sprint Goal", DateTime.UtcNow.AddDays(14), projectId);

        _projectRepository.Setup(r => r.ExistsAsync(projectId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _sprintRepository.Setup(r => r.AddAsync(It.IsAny<Sprint>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Sprint s, CancellationToken ct) => s);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Name.Should().Be("Sprint 1");
        result.Value.Goal.Should().Be("Sprint Goal");
        result.Value.IsActive.Should().BeFalse();
        result.Value.IsCompleted.Should().BeFalse();
        _sprintRepository.Verify(r => r.AddAsync(It.IsAny<Sprint>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ProjectNotFound_ShouldReturnFailure()
    {
        // Arrange
        var projectId = Guid.NewGuid();
        var command = new CreateSprintCommand("Sprint 1", "Sprint Goal", DateTime.UtcNow.AddDays(14), projectId);

        _projectRepository.Setup(r => r.ExistsAsync(projectId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailed.Should().BeTrue();
        result.Errors.Should().Contain(e => e.Message == "Project not found");
        _sprintRepository.Verify(r => r.AddAsync(It.IsAny<Sprint>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
