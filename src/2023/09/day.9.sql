WITH
    input AS (
        SELECT
            L.[ordinal] AS [Row],
            V.[ordinal] AS [Index],
            cast(V.[value] AS int) AS [Value]
        FROM 
            openrowset(BULK '/src/day.9.input.txt', SINGLE_CLOB) AS R
            CROSS APPLY string_split(R.[BulkColumn], CHAR(10), 1) AS L
            CROSS APPLY string_split(L.[value], ' ', 1) AS V
        WHERE
            1 = 1
            AND (L.[value] <> '')
    ),
    differences_1 AS (
        SELECT
            I.*,
            I.[Value] - lag(I.[Value], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [1]
        FROM
            input I
    ),
    differences_2 AS (
        SELECT
            I.*,
            I.[1] - lag(I.[1], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [2]
        FROM
            differences_1 I
    ),
    differences_3 AS (
        SELECT
            I.*,
            I.[2] - lag(I.[2], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [3]
        FROM
            differences_2 I
    ),
    differences_4 AS (
        SELECT
            I.*,
            I.[3] - lag(I.[3], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [4]
        FROM
            differences_3 I
    ),
    differences_5 AS (
        SELECT
            I.*,
            I.[4] - lag(I.[4], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [5]
        FROM
            differences_4 I
    ),
    differences_6 AS (
        SELECT
            I.*,
            I.[5] - lag(I.[5], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [6]
        FROM
            differences_5 I
    ),
    differences_7 AS (
        SELECT
            I.*,
            I.[6] - lag(I.[6], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [7]
        FROM
            differences_6 I
    ),
    differences_8 AS (
        SELECT
            I.*,
            I.[7] - lag(I.[7], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [8]
        FROM
            differences_7 I
    ),
    differences_9 AS (
        SELECT
            I.*,
            I.[8] - lag(I.[8], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [9]
        FROM
            differences_8 I
    ),
    differences_10 AS (
        SELECT
            I.*,
            I.[9] - lag(I.[9], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [10]
        FROM
            differences_9 I
    ),
    differences_11 AS (
        SELECT
            I.*,
            I.[10] - lag(I.[10], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [11]
        FROM
            differences_10 I
    ),
    differences_12 AS (
        SELECT
            I.*,
            I.[11] - lag(I.[11], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [12]
        FROM
            differences_11 I
    ),
    differences_13 AS (
        SELECT
            I.*,
            I.[12] - lag(I.[12], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [13]
        FROM
            differences_12 I
    ),
    differences_14 AS (
        SELECT
            I.*,
            I.[13] - lag(I.[13], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [14]
        FROM
            differences_13 I
    ),
    differences_15 AS (
        SELECT
            I.*,
            I.[14] - lag(I.[14], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [15]
        FROM
            differences_14 I
    ),
    differences_16 AS (
        SELECT
            I.*,
            I.[15] - lag(I.[15], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [16]
        FROM
            differences_15 I
    ),
    differences_17 AS (
        SELECT
            I.*,
            I.[16] - lag(I.[16], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [17]
        FROM
            differences_16 I
    ),
    differences_18 AS (
        SELECT
            I.*,
            I.[17] - lag(I.[17], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [18]
        FROM
            differences_17 I
    ),
    differences_19 AS (
        SELECT
            I.*,
            I.[18] - lag(I.[18], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [19]
        FROM
            differences_18 I
    ),
    differences_20 AS (
        SELECT
            I.*,
            I.[19] - lag(I.[19], 1) OVER ( PARTITION BY I.[Row] ORDER BY I.[Index] ) AS [20]
        FROM
            differences_19 I
    ),
    part_1 AS (
        SELECT 
            sum([Value] + [1] + [2] + [3] + [4] + [5] + [6] + [7] + [8] + [9] + [10] + [11] + [12] + [13] + [14] + [15] + [16] + [17] + [18] + [19] + [20]) AS [Answer] 
        FROM 
            differences_20 
        WHERE 
            1 = 1
            AND ([Index] = 21)
    ),
    part_2 AS (
        SELECT
            sum(I.[Value] - D1.[1] + D2.[2] - D3.[3] + D4.[4] - D5.[5] + D6.[6] - D7.[7] + D8.[8] - D9.[9] + D10.[10] - D11.[11] + D12.[12] - D13.[13] + D14.[14] - D15.[15] + D16.[16] - D17.[17] + D18.[18] - D19.[19] + D20.[20]) AS [Answer]
        FROM
            differences_20 D20
            JOIN differences_19 D19 ON (D19.[Row] = D20.[Row]) AND (D19.[Index] = 20)
            JOIN differences_18 D18 ON (D18.[Row] = D20.[Row]) AND (D18.[Index] = 19)
            JOIN differences_17 D17 ON (D17.[Row] = D20.[Row]) AND (D17.[Index] = 18)
            JOIN differences_16 D16 ON (D16.[Row] = D20.[Row]) AND (D16.[Index] = 17)
            JOIN differences_15 D15 ON (D15.[Row] = D20.[Row]) AND (D15.[Index] = 16)
            JOIN differences_14 D14 ON (D14.[Row] = D20.[Row]) AND (D14.[Index] = 15)
            JOIN differences_13 D13 ON (D13.[Row] = D20.[Row]) AND (D13.[Index] = 14)
            JOIN differences_12 D12 ON (D12.[Row] = D20.[Row]) AND (D12.[Index] = 13)
            JOIN differences_11 D11 ON (D11.[Row] = D20.[Row]) AND (D11.[Index] = 12)
            JOIN differences_10 D10 ON (D10.[Row] = D20.[Row]) AND (D10.[Index] = 11)
            JOIN differences_9 D9 ON (D9.[Row] = D20.[Row]) AND (D9.[Index] = 10)
            JOIN differences_8 D8 ON (D8.[Row] = D20.[Row]) AND (D8.[Index] = 9)
            JOIN differences_7 D7 ON (D7.[Row] = D20.[Row]) AND (D7.[Index] = 8)
            JOIN differences_6 D6 ON (D6.[Row] = D20.[Row]) AND (D6.[Index] = 7)
            JOIN differences_5 D5 ON (D5.[Row] = D20.[Row]) AND (D5.[Index] = 6)
            JOIN differences_4 D4 ON (D4.[Row] = D20.[Row]) AND (D4.[Index] = 5)
            JOIN differences_3 D3 ON (D3.[Row] = D20.[Row]) AND (D3.[Index] = 4)
            JOIN differences_2 D2 ON (D2.[Row] = D20.[Row]) AND (D2.[Index] = 3)
            JOIN differences_1 D1 ON (D1.[Row] = D20.[Row]) AND (D1.[Index] = 2)
            JOIN input I ON (I.[Row] = D20.[Row]) AND (I.[Index] = 1)
        WHERE
            1 = 1
            AND (D20.[Index] = 21)
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2;