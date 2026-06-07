// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssetManagement {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyOfficer() {
        require(assetOfficers[msg.sender], "Only asset officers can perform this action");
        _;
    }

    enum AssetState {
        ACTIVE,
        IDLE,
        SCRAPPED
    }

    enum ActionType {
        CREATE,
        IDLE,
        TRANSFER,
        ASSIGN,
        SCRAP
    }

    struct Asset {
        uint256 assetId;
        string currentOwner;
        AssetState status;
        uint256 registeredAt;
        bool exists;
    }

    struct AssetHistory {
        string fromOwner;
        string toOwner;
        ActionType action;
        uint256 timestamp;
    }

    mapping(uint256 => Asset) private assets;

    mapping(uint256 => AssetHistory[]) private assetHistories;

    mapping(address => bool) public assetOfficers;

    // EVENTS

    event OfficerAdded(address officer);
    event OfficerRemoved(address officer);

    event AssetCreated(
        uint256 assetId,
        string owner
    );

    event AssetMarkedIdle(
        uint256 assetId,
        string owner
    );

    event AssetTransferred(
        uint256 assetId,
        string fromOwner,
        string toOwner
    );

    event AssetAssigned(
        uint256 assetId,
        string employeeId
    );

    event AssetScrapped(
        uint256 assetId
    );

    // OFFICER MANAGEMENT

    function addOfficer(address officer)
        external
        onlyOwner
    {
        assetOfficers[officer] = true;

        emit OfficerAdded(officer);
    }

    function removeOfficer(address officer)
        external
        onlyOwner
    {
        assetOfficers[officer] = false;

        emit OfficerRemoved(officer);
    }

    // CREATE ASSET

    function createAsset(
        uint256 assetId,
        string memory ownerId
    )
        external
        onlyOfficer
    {
        require(
            !assets[assetId].exists,
            "Asset already exists"
        );

        assets[assetId] = Asset({
            assetId: assetId,
            currentOwner: ownerId,
            status: AssetState.ACTIVE,
            registeredAt: block.timestamp,
            exists: true
        });

        assetHistories[assetId].push(
            AssetHistory({
                fromOwner: "",
                toOwner: ownerId,
                action: ActionType.CREATE,
                timestamp: block.timestamp
            })
        );

        emit AssetCreated(assetId, ownerId);
    }

    // ACTIVE -> IDLE

    function approveIdle(
        uint256 assetId
    )
        external
        onlyOfficer
    {
        require(
            assets[assetId].exists,
            "Asset does not exist"
        );

        require(
            assets[assetId].status == AssetState.ACTIVE,
            "Asset must be ACTIVE"
        );

        assets[assetId].status = AssetState.IDLE;

        assetHistories[assetId].push(
            AssetHistory({
                fromOwner: assets[assetId].currentOwner,
                toOwner: assets[assetId].currentOwner,
                action: ActionType.IDLE,
                timestamp: block.timestamp
            })
        );

        emit AssetMarkedIdle(
            assetId,
            assets[assetId].currentOwner
        );
    }

    // IDLE -> ANOTHER FACULTY STORAGE

    function transferAsset(
        uint256 assetId,
        string memory newOwner
    )
        external
        onlyOfficer
    {
        require(
            assets[assetId].exists,
            "Asset does not exist"
        );

        require(
            assets[assetId].status == AssetState.IDLE,
            "Asset must be IDLE"
        );

        string memory previousOwner =
            assets[assetId].currentOwner;

        assets[assetId].currentOwner = newOwner;

        assetHistories[assetId].push(
            AssetHistory({
                fromOwner: previousOwner,
                toOwner: newOwner,
                action: ActionType.TRANSFER,
                timestamp: block.timestamp
            })
        );

        emit AssetTransferred(
            assetId,
            previousOwner,
            newOwner
        );
    }

    // FACULTY STORAGE -> EMPLOYEE

    function assignAsset(
        uint256 assetId,
        string memory employeeId
    )
        external
        onlyOfficer
    {
        require(
            assets[assetId].exists,
            "Asset does not exist"
        );

        require(
            assets[assetId].status == AssetState.IDLE,
            "Asset must be IDLE"
        );

        string memory previousOwner =
            assets[assetId].currentOwner;

        assets[assetId].currentOwner = employeeId;

        assets[assetId].status = AssetState.ACTIVE;

        assetHistories[assetId].push(
            AssetHistory({
                fromOwner: previousOwner,
                toOwner: employeeId,
                action: ActionType.ASSIGN,
                timestamp: block.timestamp
            })
        );

        emit AssetAssigned(
            assetId,
            employeeId
        );
    }

    // SCRAP ASSET

    function scrapAsset(
        uint256 assetId
    )
        external
        onlyOfficer
    {
        require(
            assets[assetId].exists,
            "Asset does not exist"
        );

        require(
            assets[assetId].status != AssetState.SCRAPPED,
            "Already scrapped"
        );

        assets[assetId].status =
            AssetState.SCRAPPED;

        assetHistories[assetId].push(
            AssetHistory({
                fromOwner: assets[assetId].currentOwner,
                toOwner: "SCRAPPED",
                action: ActionType.SCRAP,
                timestamp: block.timestamp
            })
        );

        emit AssetScrapped(assetId);
    }

    // GET ASSET

    function getAsset(
        uint256 assetId
    )
        external
        view
        returns (
            uint256,
            string memory,
            AssetState,
            uint256
        )
    {
        require(
            assets[assetId].exists,
            "Asset does not exist"
        );

        Asset memory asset =
            assets[assetId];

        return (
            asset.assetId,
            asset.currentOwner,
            asset.status,
            asset.registeredAt
        );
    }

    // GET HISTORY

    function getAssetHistory(
        uint256 assetId
    )
        external
        view
        returns (
            AssetHistory[] memory
        )
    {
        require(
            assets[assetId].exists,
            "Asset does not exist"
        );

        return assetHistories[assetId];
    }
}