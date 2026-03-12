using System;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Resend;

namespace Infrastructure.Email;

public class EmailSender(IServiceScopeFactory scopeFactory) : IEmailSender<User>
{
    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        var subject = "Confirm your email address";
        var body = $@"
            <p>Hi {user.UserName},</p>
            <p>Please confirm your email address by clicking the link below:</p>
            <a href='{confirmationLink}'>Confirm Email</a>
            <p>Thank you.</p>";

        await SendMailAsync(email, subject, body);
    }


    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    private async Task SendMailAsync(string email, string subject, string body)
    {
        using var scope = scopeFactory.CreateScope();
        var resend = scope.ServiceProvider.GetRequiredService<ResendClient>();

        var emailMessage = new EmailMessage
        {
            From = "whatever@resend.dev",
            Subject = subject,
            HtmlBody = body
        };
        emailMessage.To.Add(email);

        Console.WriteLine(emailMessage.HtmlBody);

        await resend.EmailSendAsync(emailMessage);
        //await Task.CompletedTask;
    }
}
