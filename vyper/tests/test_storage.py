import pytest
import brownie

INITIAL_VALUE = 4


@pytest.fixture
def storage_contract(SimpleStorage, accounts):
    # Deploy the contract with the initial value as a constructor argument
    yield SimpleStorage.deploy(INITIAL_VALUE, {'from': accounts[0]})


def test_initial_state(storage_contract):
    # Check if the constructor of the contract is set properly
    assert storage_contract.storeData() == INITIAL_VALUE


def test_set(storage_contract, accounts):
    storage_contract.set(75, {'from': accounts[0]})
    assert storage_contract.storeData() == 75  # Directly acces storeData

# Testing Events


def test_events(storage_contract, accounts):
    tx1 = storage_contract.set(12, {'from': accounts[0]})
    tx2 = storage_contract.set(27, {'from': accounts[1]})
    tx3 = storage_contract.reset({'from': accounts[0]})

    # Check log contents
    assert len(tx1.events) == 1
    assert tx1.events[0]['value'] == 12
    assert tx1.events[0]['setter'] == accounts[0]

    assert len(tx2.events) == 1
    assert tx2.events[0]['value'] == 27
    assert tx2.events[0]['setter'] == accounts[1]

    # tx3 does not generate a log
    assert not tx3.events


# Handling Reverted Transactions


def test_failed_transactions(storage_contract, accounts):
    # Try to set the storage to a negative value
    with brownie.reverts("No negative values"):
        storage_contract.set(-777, {'from': accounts[1]})

    # Lock the contract by storing more than 100. Then try to change the value
    storage_contract.set(111, {'from': accounts[1]})
    with brownie.reverts("Storage is locked when 100 or more is stored"):
        storage_contract.set(10, {'from': accounts[1]})

    # Reset the contract and try to change the value
    storage_contract.reset({'from': accounts[1]})
    storage_contract.set(14, {'from': accounts[1]})
    assert storage_contract.storeData() == 14
