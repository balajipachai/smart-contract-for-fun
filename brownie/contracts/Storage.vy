# @version ^0.2.0

event DataChanged:
    setter: indexed(address)
    oldValue: int128
    newValue: int128

storedData : public(int128)

@external
def __init__(x: int128):
    self.storedData = x

@external
def set(x: int128):
    assert x >= 0, "No negative values"
    assert self.storedData < 250, "Storage is locked as value is greater than 250"
    oldValue: int128 = self.storedData
    self.storedData = x
    log DataChanged(msg.sender, oldValue, x)

@external
def reset():
    self.storedData = 0