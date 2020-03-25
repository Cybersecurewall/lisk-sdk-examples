import {
  Alert,
  Badge,
  Button,
  Card, CardBody, CardHeader,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import {
  faFileInvoice, faCircleNotch, faArrowLeft, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { utils } from '@liskhq/lisk-transactions';
import React from 'react';


import { formatAmount, formatTimestamp } from '../utils/formatters';
import { useInvoices } from '../hooks';
import { useStateValue } from '../state';

function InvoicesPage() {
  const [{ account: { address } }] = useStateValue();

  const [transactions, loading, error] = useInvoices({ address });

  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row between="xs">
              <h3>My Invoices</h3>
              <Link to="/send-invoice">
                <Button color="primary">Send new Invoice</Button>
              </Link>
            </Row>
          </CardHeader>
          {transactions.length
            ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Sender/Recepient</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(({
                    id, senderId, recipientId, timestamp, paidStatus,
                    asset: { description, requestedAmount },
                  }) => (
                    <tr key={id}>
                      <td>
                        <FontAwesomeIcon icon={senderId === address ? faArrowLeft : faArrowRight} />
                        &nbsp;
                        {senderId === address ? recipientId : senderId}
                      </td>
                      <td>{formatTimestamp(timestamp).toString()}</td>
                      <td>{description}</td>
                      <td>{formatAmount(requestedAmount)}</td>
                      <td>
                        {paidStatus
                          ? <Badge color="success">Paid</Badge>
                          : (
                            <Link to={`/pay-invoice?address=${senderId}&amount=${utils.convertBeddowsToLSK(requestedAmount)}&invoiceID=${id}&description=${description}`}>
                              <Button>Pay</Button>
                            </Link>
                          )
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
            : (
              <CardBody>
                { error
                  ? (
                    <Alert color="danger">
                      <pre>
                        {error}
                      </pre>
                    </Alert>
                  )
                  : (
                    <Row center="xs">
                      <Col>
                        <p>
                          <FontAwesomeIcon icon={loading ? faCircleNotch : faFileInvoice} spin={loading} size="6x" />
                        </p>
                        { !loading
                          ? <p>There are no invoices yet. Start by sending a new invoice.</p>
                          : null
                      }
                      </Col>
                    </Row>
                  )
                }
              </CardBody>
            )
            }
        </Card>
      </Col>
    </Row>
  );
}

export default InvoicesPage;
