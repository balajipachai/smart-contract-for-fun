import pytest
import brownie

INITIAL_VALUE = 4

@pytest.fixture
def storage_contract(Storage, accounts):
    yield Storage.deploy(INITIAL_VALUE, { 'from': accounts[0] })

def test_initial_state(storage_contract):
    assert storage_contract.storedData() == INITIAL_VALUE

def test_set(storage_contract, accounts):
    # set value to 100
    storage_contract.set(100, {'from': accounts[0]})
    assert storage_contract.storedData() == 100

def test_events(storage_contract, accounts):
    tx1 = storage_contract.set(10, {'from': accounts[0]})
    tx2 = storage_contract.reset({'from': accounts[0]})

    #Check log contents
    assert len(tx1.events) == 1
    assert tx1.events[0]['setter'] == accounts[0]
    assert tx1.events[0]['oldValue'] == 4
    assert tx1.events[0]['newValue'] == 10

    # tx2 does not generate a log
    assert not tx2.events

def test_failed_transactions(storage_contract, accounts):
    with brownie.reverts("No negative values"):
        storage_contract.set(-10, {'from': accounts[0]})

    storage_contract.set(300, {'from': accounts[1]})
    with brownie.reverts("Storage is locked as value is greater than 250"):
        storage_contract.set(10, {'from': accounts[0]})

