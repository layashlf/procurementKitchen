import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import { updatePageData } from "../../storage/actions";
import { ROUTERS } from "../../constants/routers.constant";
import PageNotFound from "../pageNotFound/PageNotFound.component";
import { LandingPageComponent } from "../landingPage/LandingPage.component";
import GoodReceivedList from "../goodsReceivedList/GoodsReceivedList.component";
import GoodsReceivedDetails from "../goodsReceivedList/GoodsReceivedDetails.component";
import GoodsReceivedComponent from "../goodsReceivedList/GoodsReceivedForm.component";

interface Props {
  state?: any;
}
export default function RouterComponent(props: Props) {
  const { userLoggedIn } = props.state;

  const { GOOD_RECEIVED_PAGE, GOOD_RECEIVED } = ROUTERS;
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(updatePageData());
  }, []);

  const routes = useRoutes([
    {
      path: "/",
      element: <LandingPageComponent />,

      children: [
        { path: GOOD_RECEIVED_PAGE, element: <GoodReceivedList /> },
        userLoggedIn
          ? {
              path: "/",
              element: <Navigate to={`${GOOD_RECEIVED}page/1`} />,
            }
          : { path: "/", element: <Navigate to="/login" /> },
      ],
    },
    { path: `${GOOD_RECEIVED}:id`, element: <GoodsReceivedDetails /> },
    { path: `${GOOD_RECEIVED}new`, element: <GoodsReceivedComponent /> },
    { path: "*", element: <PageNotFound /> },
  ]);
  return routes;
}
