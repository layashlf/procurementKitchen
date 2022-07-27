import { Helmet } from "react-helmet";

interface PageTitleProps {
  pageTitle: string;
}
export default function PageTitle(props: PageTitleProps) {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>
        {props.pageTitle !== "" ? `${props.pageTitle} - ` : ""} LF Procurement
      </title>
    </Helmet>
  );
}
