using System;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Client;
using Resend;

namespace Infrastructure.Email;

public class EmailSender(IResend resend, IConfiguration config) : IEmailSender<User>
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


    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        var subject = "Reset your password";
        var body = $@"
            <p>Hi {user.UserName},</p>
            <p>Please click this click to reset your password:</p>
            <p>
                <a href='{config["ClientAppUrl"]}/reset-password?email={email}&code={resetCode}'>
                        Reset Password
                </a>
            </p>
            <p>Please ignore, if you did not request this!</p>";

        await SendMailAsync(email, subject, body);
    }

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    private async Task SendMailAsync(string email, string subject, string body)
    {
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
