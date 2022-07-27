import * as React from "react";
import GoodsReceivedPrint from "./GoodsReceivedPrint.component";
import { SHEETS_NAME_LIST } from "../../constants/sheetsList.constants";

type Props = {
  items?: any;
  basics?: any;
  page: string;
  titleText?: string;
};

type State = {
  checked: boolean;
};

export class ComponentToPrint extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { checked: false };
  }

  private handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

  public render() {
    const { items, basics, page } = this.props;
    if (page === SHEETS_NAME_LIST.GOOD_RECEIVED) {
      return <GoodsReceivedPrint items={items} basics={basics} />;
    }
    return <div className="test">{"data.requester"}</div>;
  }
}

export const FunctionalComponentToPrint = React.forwardRef<
  ComponentToPrint | null,
  Props
>((props, ref) => {
  // eslint-disable-line max-len
  return (
    <ComponentToPrint
      ref={ref}
      items={props.items}
      basics={props.basics}
      page={props.page}
      titleText={props.titleText}
    />
  );
});
