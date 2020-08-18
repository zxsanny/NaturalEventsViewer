namespace NaturalEventsViewer.Infrastructure
{
    /// <summary>
    /// Represents public session of the web application
    /// that can be shared in browser's window object.
    /// </summary>
    public class IsomorphicSessionData
    {
    }

    /// <summary>
    /// Represents the isomorphic session for web application.
    /// </summary>
    public class WebSessionContext
    {
        /// <summary>
        /// Contains public session that you can share in the browser's window object.
        /// </summary>
        public IsomorphicSessionData Isomorphic { get; set; }

        public WebSessionContext()
        {
            Isomorphic = new IsomorphicSessionData();
        }
    }
}