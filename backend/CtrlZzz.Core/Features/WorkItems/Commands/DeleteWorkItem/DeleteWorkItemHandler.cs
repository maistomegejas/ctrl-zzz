using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.DeleteWorkItem;

public class DeleteWorkItemHandler : IRequestHandler<DeleteWorkItemCommand, Result>
{
    private readonly IRepository<WorkItem> _workItemRepository;

    public DeleteWorkItemHandler(IRepository<WorkItem> workItemRepository)
    {
        _workItemRepository = workItemRepository;
    }

    public async Task<Result> Handle(DeleteWorkItemCommand request, CancellationToken cancellationToken)
    {
        var workItem = await _workItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (workItem == null)
        {
            return Result.Fail("Work item not found");
        }

        await _workItemRepository.DeleteAsync(workItem, cancellationToken);

        return Result.Ok();
    }
}
