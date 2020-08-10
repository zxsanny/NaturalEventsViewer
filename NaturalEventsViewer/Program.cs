using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.IO;

namespace NaturalEventsViewer
{
    public class Program
    {
        public static string EnvironmentName =>
            Environment.GetEnvironmentVariable("NaturalEventsViewer_ENV") ?? "Production";

        public static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Build())
                .CreateLogger();

            try
            {
                CreateHostBuilder(args, builder)
                    .Build()
                    .Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly.");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args, IConfigurationBuilder configurationBuilder)
        {
            return Host
                .CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                    .UseIISIntegration()
                    .ConfigureKestrel(serverOptions =>
                    {
                        // Set properties and call methods on options.
                    })
                    .UseConfiguration(
                        configurationBuilder
                        .AddJsonFile("hosting.json", optional: true, reloadOnChange: true)
                        .AddJsonFile($"hosting.{EnvironmentName}.json", optional: true)
                        .Build()
                    )
                    .UseStartup<Startup>();
                });
        }
    }
}