import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "BookStore | Online Book Store",
  description = "Discover and shop books online at BookStore.",
  noindex = false,
}) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEO;
