import pytest

INITIAL_VALUE = 4


@pytest.fixture
def storage_contract(Storage, accounts):
    # Deploy the contract with the initial value as a constructor argument
    yield Storage.deploy(INITIAL_VALUE, {'from': accounts[0]})


def test_initial_state(storage_contract):
    # Check if the constructor of the contract is set properly
    assert storage_contract.storeData() == INITIAL_VALUE


def test_set(storage_contract, accounts):
    storage_contract.set(705, {'from': accounts[0]})
    assert storage_contract.storeData() == 705  # Directly acces storeData

    # set value to -777
    storage_contract.set(-777, {'from': accounts[0]})
    assert storage_contract.storeData() == -777
