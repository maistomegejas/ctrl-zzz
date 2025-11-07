namespace CtrlZzz.Core.Constants;

public static class Permissions
{
    // Admin
    public const string AccessAdminPanel = "Admin.AccessAdminPanel";
    public const string ManageRoles = "Admin.ManageRoles";
    public const string ManagePermissions = "Admin.ManagePermissions";

    // Users
    public const string ViewUsers = "Users.View";
    public const string ManageUsers = "Users.Manage";

    // Projects
    public const string CreateProject = "Projects.Create";
    public const string EditProject = "Projects.Edit";
    public const string DeleteProject = "Projects.Delete";
    public const string ManageProjectMembers = "Projects.ManageMembers";

    // WorkItems
    public const string CreateWorkItem = "WorkItems.Create";
    public const string EditWorkItem = "WorkItems.Edit";
    public const string DeleteWorkItem = "WorkItems.Delete";
    public const string AssignWorkItem = "WorkItems.Assign";

    // Comments
    public const string CreateComment = "Comments.Create";
    public const string EditComment = "Comments.Edit";
    public const string DeleteComment = "Comments.Delete";

    // Sprints
    public const string CreateSprint = "Sprints.Create";
    public const string EditSprint = "Sprints.Edit";
    public const string DeleteSprint = "Sprints.Delete";

    // Groups
    public const string CreateGroup = "Groups.Create";
    public const string EditGroup = "Groups.Edit";
    public const string DeleteGroup = "Groups.Delete";
    public const string ManageGroupMembers = "Groups.ManageMembers";
}
