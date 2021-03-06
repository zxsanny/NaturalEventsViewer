using EONETAPIImplementation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NaturalEvents.Common.Interfaces;
using NaturalEvents.Repostitory;
using NaturalEventsViewer.Extensions;
using NaturalEventsViewer.Infrastructure;
using Serilog;
using Serilog.Context;
using System;

namespace NaturalEventsViewer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Configuration.GetSection("AppSettings").Bind(AppSettings.Default);

            services.AddLogging(loggingBuilder =>
                loggingBuilder.AddSerilog(dispose: true));

            services.AddControllersWithViews(opts =>
            {
                opts.Filters.Add<SerilogMvcLoggingAttribute>();
            });

            services.AddNodeServicesWithHttps(Configuration);

#pragma warning disable CS0618 // Type or member is obsolete
            services.AddSpaPrerenderer();
#pragma warning restore CS0618 // Type or member is obsolete

            services.AddHttpClient<IEONETApi, EONETApi>("EONETAPI", c =>
            {
                c.BaseAddress = new Uri(Configuration.GetValue<string>("EONETBaseURL"));
            }).SetHandlerLifetime(TimeSpan.FromMinutes(10));
            services.AddLazyCache();
            services.AddScoped<IEONETRepository, EONETRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            // Adds an IP address to your log's context.
            app.Use(async (context, next) =>
            {
                using (LogContext.PushProperty("IPAddress", context.Connection.RemoteIpAddress))
                {
                    await next.Invoke();
                }
            });

            //// Build your own authorization system or use Identity.
            //app.Use(async (context, next) =>
            //{
            //    var accountService = (AccountService)context.RequestServices.GetService(typeof(AccountService));
            //    var verifyResult = accountService.Verify(context);
            //    if (!verifyResult.HasErrors)
            //    {
            //        context.Items.Add(Constants.HttpContextServiceUserItemKey, verifyResult.Value);
            //    }
            //    await next.Invoke();
            //    // Do logging or other work that doesn't write to the Response.
            //});

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
#pragma warning disable CS0618 // Type or member is obsolete
                WebpackDevMiddleware.UseWebpackDevMiddleware(app, new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
#pragma warning restore CS0618 // Type or member is obsolete
            }
            else
            {
                app.UseExceptionHandler("/Main/Error");
                app.UseHsts();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Write streamlined request completion events, instead of the more verbose ones from the framework.
            // To use the default framework request logging instead, remove this line and set the "Microsoft"
            // level in appsettings.json to "Information".
            app.UseSerilogRequestLogging();

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Main}/{action=Index}/{id?}");

                endpoints.MapFallbackToController("Index", "Main");
            });

            app.UseHttpsRedirection();
        }
    }
}