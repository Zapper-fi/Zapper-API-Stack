///@notice This contract executes Zapper Transaction API calldata

pragma solidity ^0.5.7;
import "../oz/token/ERC20/IERC20.sol";
import "../oz/math/SafeMath.sol";
import "../oz/token/ERC20/SafeERC20.sol";

contract Zap_Consumer_V1 {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /**
    @param sellTokenAddress The 'sellTokenAddress' from the API response
    @param buyTokenAddress The 'buyTokenAddress' field from the API response
    @param sellTokenQuantity The 'value' field from the API response
    @param zapContract The 'to' field from the API response
    @param data The 'data' field from the API response
    */
    function Zap(
        address sellTokenAddress,
        uint256 sellTokenQuantity,
        address buyTokenAddress,
        address zapContract,
        bytes calldata data
    ) external payable returns (uint256 tokensRec) {
        if (sellTokenAddress != address(0)) {
            IERC20(sellTokenAddress).safeTransferFrom(
                msg.sender,
                address(this),
                sellTokenQuantity
            );
        }

        tokensRec = _fillQuote(
            sellTokenAddress,
            buyTokenAddress,
            sellTokenQuantity,
            zapContract,
            data
        );

        if (buyTokenAddress != address(0)) {
            IERC20(buyTokenAddress).safeTransfer(msg.sender, tokensRec);
        } else {
            Address.sendValue(Address.toPayable(msg.sender), tokensRec);
        }
    }

    function _fillQuote(
        address fromToken,
        address toToken,
        uint256 amount,
        address swapTarget,
        bytes memory swapData
    ) internal returns (uint256 finalBalance) {
        uint256 valueToSend;
        if (fromToken == address(0)) valueToSend = amount;
        else _approveToken(fromToken, swapTarget);

        uint256 initialBalance = _getBalance(toToken);

        (bool success, ) = swapTarget.call.value(valueToSend)(swapData);
        require(success, "Zap Failed");

        finalBalance = _getBalance(toToken).sub(initialBalance);

        require(finalBalance > 0, "Swapped to Invalid Token");
    }

    function _approveToken(address token, address spender) internal {
        if (token == address(0)) return;
        IERC20 _token = IERC20(token);
        if (_token.allowance(address(this), spender) > 0) return;
        else {
            _token.safeApprove(spender, uint256(-1));
        }
    }

    function _getBalance(address token)
        internal
        view
        returns (uint256 balance)
    {
        if (token == address(0)) {
            balance = address(this).balance;
        } else {
            balance = IERC20(token).balanceOf(address(this));
        }
    }

    function() external payable {
        require(msg.sender != tx.origin, "Do not send ETH directly");
    }
}
