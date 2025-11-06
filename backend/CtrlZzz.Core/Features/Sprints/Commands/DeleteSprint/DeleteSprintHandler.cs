using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.DeleteSprint;

public class DeleteSprintHandler : IRequestHandler<DeleteSprintCommand, Result>
{
    private readonly IRepository<Sprint> _sprintRepository;

    public DeleteSprintHandler(IRepository<Sprint> sprintRepository)
    {
        _sprintRepository = sprintRepository;
    }

    public async Task<Result> Handle(DeleteSprintCommand request, CancellationToken cancellationToken)
    {
        var sprint = await _sprintRepository.GetByIdAsync(request.Id, cancellationToken);
        if (sprint == null)
        {
            return Result.Fail("Sprint not found");
        }

        await _sprintRepository.DeleteAsync(sprint, cancellationToken);

        return Result.Ok();
    }
}
