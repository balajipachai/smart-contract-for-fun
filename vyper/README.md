# Getting started with Vyper

1. Install Vyper
    - docker pull vyperlang/vyper

2. Launch the Vyper docker container
    - docker run -v $(pwd):/code/ -it --entrypoint /bin/bash vyperlang/vyper

3. Compiling the contracts
    - vyper fineName.vy

4. Testing (Using Brownie)
    - Initialze with `brownie init`
    - Write your contracts in the `contracts` directory
    - Write your tests in the `tests` directory