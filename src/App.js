import React from "react";
import localforage from "localforage";

import Button from "react-bootstrap/Button";
import './App.css';

const Dash = require("dash");


class App extends React.Component {


  retrieveIdentitiesLocalForageTest = () => {

    
//localforage.config({name: 'localforage'});//https://localforage.github.io/localForage/#settings-api-setdriver says config is syncrochnous

//TEST
    //   localforage.config({
    //   driver: localforage.INDEXEDDB.dashevowalletlib,
    //   name        : 'dashevo-wallet-lib',
    //   version     : 1.0,
    //   size        : 4980736,
    //   storeName   : 'keyvaluepairs',
    // });

//************************************************************https://github.com/localForage/localForage/issues/872 */


 console.log(`argAdapter.constructor.name: ${localforage.constructor.name}`);

    const client = new Dash.Client({
      network: 'testnet',
  wallet: {
    mnemonic: 'miss sunny immune barrel flush crash muffin orient sick paper bless world',
    //Just grabbed a random mnem with 0 Dash in wallet, its not needed just need to establish the wallet.
        adapter:   localforage,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: 883000,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      return account.identities.getIdentityIds();
    };


    retrieveIdentityIds()
      .then((d) => {
        //console.log("Mnemonic identities:\n", d);
        console.log('Test Complete');
      })
      .catch((e) =>{ console.error("Something went wrong:\n", e);
      
    })
      .finally(() => client.disconnect());
  }; 

  retrieveIdentitiesLocalForageInstanceTest = () => {

//TEST
    //   localforage.config({
    //   driver: localforage.INDEXEDDB.dashevowalletlib,
    //   name        : 'dashevo-wallet-lib',
    //   version     : 1.0,
    //   size        : 4980736,
    //   storeName   : 'keyvaluepairs',
    // });

let store = localforage.createInstance({name: 'dashevo-wallet-lib'}); 
//************************************************************https://github.com/localForage/localForage/issues/872 */

 console.log(`LocalForage Instance Passed. argAdapter.constructor.name: ${store.constructor.name}`);

    const client = new Dash.Client({
      network: 'testnet',
  wallet: {
    mnemonic: 'miss sunny immune barrel flush crash muffin orient sick paper bless world',//Just grabbed a random mnem with 0 Dash in wallet, its not needed just need to establish the wallet.
        adapter:   store,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: 883000,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Mnemonic identities:\n", d);
        
      })
      .catch((e) =>{ console.error("Something went wrong:\n", e);
      
    })
      .finally(() => client.disconnect());
  }; 

  render(){
  return (
    <div className="App">
      <h3>Dash-Wallet-Lib-Adapter-LocalForage-Test</h3>
      <p>
      </p>
      <p>Before the test,
        right-click and inspect page, view the console, it outputs the argAdapter.constructor.name and Test Complete. You have to manually keep time to see the difference between start and finish for the testing.</p> 
        <p></p>
      

      <ol>
        <li>
          <p>Press one of the buttons with the console open, you will see the argAdapter.constructor.name at the start of the test.  </p>
        </li>
        <li>
          Then you will see <b>Test Complete</b> at the end. IMPORTANT: You have to manual keep time with the test to figure out the issue.
          <p></p>
        </li>
        <li>
          For the first page load or after a page refresh, the sync takes 12 to 15 seconds (based on the skipHeight of 883000, randomly chosen).
          <p></p>
        </li>
        <li>
          But as long as you dont refresh the page, the sync after only takes about 3 or 4 seconds. (Because the default config for localforage has been established already, and it is using it.)
          <p></p>
        </li>
        <li>
          Refresh the page and the sync takes 12 to 15 seconds again.
        </li>
      </ol>
      <Button onClick={()=>this.retrieveIdentitiesLocalForageTest()}>Test 1 LocalForage</Button>
      <p>Test 1 passes localforage (what is imported from library) to the adapter </p>
      <Button onClick={()=>this.retrieveIdentitiesLocalForageTest()}>Test 2 LocalForage Instance</Button>
      <p>Test 2 passes localforage instance to the adapter </p>
      <p></p>
      <p></p>
      <ul>
      <li> Also you need to right-click, inspect page and in "Application then Storage" watch the 'localforage' database get created which should be 'dashevo-wallet-lib.</li>
      <li>And you will see the issue is in the code here: https://github.com/dashpay/platform/blob/master/packages/wallet-lib/src/types/Storage/_configureAdapter.js</li>
      <li>The code never sees "Function" or "Object" and because the adapter is called localforage, it passes the tests, because localStorage does have setItem and getItem but never establishes a config until after the first full sync so when the page is refreshed the config is lost and the localforage storage is useless.</li>
      </ul>
    </div>
  );
}
}

export default App;
