using System;

namespace API.DTOs;

public class ChangePasswordDto
{
    public required string CurrentPassword { get; set; } = string.Empty;
    public required string NewPassword { get; set; } = string.Empty;
}
