import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';

import { fetchBalances } from '../../../redux/modules/app/dashboard';

import RegisterToken from '../RegisterToken';
import Transactions from '../Transactions';
import TokenTransfer from '../TokenTransfer';

let fetchRepeater;

class Dashboard extends Component {
  componentDidMount() {
    const { fetchBalances } = this.props;
    fetchBalances();
    fetchRepeater = setInterval(fetchBalances, 15000);
  }

  componentWillUnmount() {
    clearInterval(fetchRepeater);
  }

  render() {
    const {
      ethBalance,
      erc20TokensBalance
    } = this.props;

    const renderTableRow = (token) => (
      <tr key={token.contractAddress}>
        <td>{token.symbol}</td>
        <td>{token.balance}</td>
      </tr>
    );

    return (
      <div className="animated fadeIn mt-4">
        <Row>
          <Col xs="12" lg="8">
            <TokenTransfer/>
            <Transactions/>
          </Col>

          <Col xs="12" lg="4">
            <Card className="bg-white">
              <CardHeader>
                <h4 className="my-0">Balances</h4>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <tbody>
                  {renderTableRow({ symbol: 'ETH', balance: ethBalance, contractAddress: 'eth' })}
                  {erc20TokensBalance
                    .filter((token) => token.balance > 0)
                    .map((token) => renderTableRow(token))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>

            <RegisterToken/>
          </Col>

        </Row>
      </div>
    );
  }
}

const ConnectedComponent = connect(
  (state) => ({
    ...state.app.dashboard,
    ...state.app.app.user
  }),
  {
    fetchBalances
  }
)(Dashboard);
const ComponentWithRouter = withRouter(ConnectedComponent);
export default ComponentWithRouter;
