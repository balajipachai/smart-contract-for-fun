pragma solidity >0.4.23 <0.7.0;

/// @title Fibonacci contract
/// @author Balaji Shetty Pachai
/// @notice Given 'n' calculate the nth Fibonacci number
contract Fibonacci {
    mapping (uint=>uint) public nthFiboNumber;
    uint[] public fiboSeries;
    event NewFibonacciCalculated(uint number, uint timestamp);
    
    /// Fallback function
    function() external payable {
        msg.sender.transfer(msg.value);
    }
    
    /// Constructor function
    constructor() public {
        // For n = 0 or n = 1
        nthFiboNumber[0] = 1;
        nthFiboNumber[1] = 1;
        fiboSeries.push(nthFiboNumber[0]);
        fiboSeries.push(nthFiboNumber[1]);
    }

    /// @dev Function that calculates the fibonacci series
    function fibo(uint _n) public returns (uint) {
        if (_n == 0 || _n == 1) {
            return 1;
        }
        if (nthFiboNumber[_n] == 0) {
            nthFiboNumber[_n] = (fibo(_n - 1) + fibo(_n - 2));
            emit NewFibonacciCalculated(nthFiboNumber[_n], now);
            fiboSeries.push(nthFiboNumber[_n]);
            return nthFiboNumber[_n];
        } else {
            return nthFiboNumber[_n];
        }
    }

    /// @dev Function that gets the fibonacci series
    function getFiboSeries() public view returns (uint[] memory) {
        return fiboSeries;
    }
}