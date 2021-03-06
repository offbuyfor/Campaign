import React, { Component } from "react";
import Layout from "../../components/layout";
import { Form, Button, Input, Message, Icon, Label } from "semantic-ui-react";
import getContract from '../../lib/getContract';
import getWeb3 from '../../lib/getWeb3';
import {Router} from '../../routes';
import IPFS from '../../lib/ipfs';
class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage :'',
    loading:false,
    buffer:''
  };
  
   onSubmit = async(event) =>{
     event.preventDefault();
     this.setState({loading:true,errorMessage:''});
     try{
        const fileAdded = await IPFS.files.add(this.state.buffer);
        const accounts = await getWeb3.eth.getAccounts();
        await getContract.methods
               .createCampaign(this.state.minimumContribution,fileAdded[0].hash)
               .send({from:accounts[0]});
        Router.pushRoute('/');
     } catch(err){
        this.setState({errorMessage:err.message});
     }
     this.setState({loading:false});
   }

   captureFile = (event)=>{
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () =>{
      this.setState({buffer:Buffer(reader.result)});
    }
   }
  render() {
    return (
      <Layout>
        <h3> Create new Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Banner Image</label>
            <Label as="label" basic htmlFor="upload">
              <Button icon="upload"
                      label="Select File"
                      labelPosition="right"
              />
              <input hidden id="upload" type="file" onChange={this.captureFile}></input>
            </Label>
          </Form.Field>
          <Message error header="Something went wrong" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
