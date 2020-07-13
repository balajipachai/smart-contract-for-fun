event DataChange:
    setter: indexed(address)
    value: int128
    
storeData: public(int128)

@external
def __init__(_x: int128):
    self.storeData = _x

@external
def set(_x: int128):
    assert _x >= 0, "No negative values"
    assert self.storeData < 100, "Storage is locked when 100 or more is stored"
    self.storeData = _x
    log DataChange(msg.sender, _x)

@external
def reset():
    self.storeData = 0