WITH
    input AS (
        SELECT
            lines.[Row],
            indices.[Type],
            cast(substring(lines.[Content], indices.[StartIndex], 2) AS int) AS [Value]
        FROM
            (
                SELECT
                    L.[ordinal] AS [Row],
                    L.[value] AS [Content]
                FROM
                    openrowset(BULK '/src/day.4.input.txt', SINGLE_CLOB) AS I
                    CROSS APPLY string_split([BulkColumn], CHAR(10), 1) AS L
                WHERE
                    1 = 1
                    AND ([value] <> '')
            ) AS lines
            CROSS JOIN (
                SELECT
                    'W' AS [Type],
                    [value] AS [StartIndex]
                FROM
                    generate_series(11, 38, 3)

                UNION ALL

                SELECT
                    'M' AS [Type],
                    [value] AS [StartIndex]
                FROM
                    generate_series(43, 115, 3)
            ) AS indices
    ),
    match_counts AS (
        SELECT
            I1.[Row],
            sum(iif(I2.[Row] IS NULL, 0, 1)) AS [MatchCount]
        FROM
            input I1
            LEFT JOIN input I2 ON (I2.[Row] = I1.[Row]) AND (I2.[Type] = 'W') AND (I2.[Value] = I1.[Value])
        WHERE
            1 = 1
            AND (I1.[Type] = 'M')
        GROUP BY
            I1.[Row]
    ),
    match_count_windows AS (
        SELECT
            M0.[Row],
            iif(M1.[MatchCount] > 0, 1, 0) AS [1],
            iif(M2.[MatchCount] > 1, 1, 0) AS [2],
            iif(M3.[MatchCount] > 2, 1, 0) AS [3],
            iif(M4.[MatchCount] > 3, 1, 0) AS [4],
            iif(M5.[MatchCount] > 4, 1, 0) AS [5],
            iif(M6.[MatchCount] > 5, 1, 0) AS [6],
            iif(M7.[MatchCount] > 6, 1, 0) AS [7],
            iif(M8.[MatchCount] > 7, 1, 0) AS [8],
            iif(M9.[MatchCount] > 8, 1, 0) AS [9],
            iif(M10.[MatchCount] > 9, 1, 0) AS [10]
        FROM
            match_counts M0
            LEFT JOIN match_counts M1 ON (M1.[Row] = M0.[Row] - 1)
            LEFT JOIN match_counts M2 ON (M2.[Row] = M0.[Row] - 2)
            LEFT JOIN match_counts M3 ON (M3.[Row] = M0.[Row] - 3)
            LEFT JOIN match_counts M4 ON (M4.[Row] = M0.[Row] - 4)
            LEFT JOIN match_counts M5 ON (M5.[Row] = M0.[Row] - 5)
            LEFT JOIN match_counts M6 ON (M6.[Row] = M0.[Row] - 6)
            LEFT JOIN match_counts M7 ON (M7.[Row] = M0.[Row] - 7)
            LEFT JOIN match_counts M8 ON (M8.[Row] = M0.[Row] - 8)
            LEFT JOIN match_counts M9 ON (M9.[Row] = M0.[Row] - 9)
            LEFT JOIN match_counts M10 ON (M10.[Row] = M0.[Row] - 10)
    ),
    scratchcard_counts AS (
        SELECT
            1 AS [Row],
            1 AS [ScratchcardCount],
            0 AS [1],
            0 AS [2],
            0 AS [3],
            0 AS [4],
            0 AS [5],
            0 AS [6],
            0 AS [7],
            0 AS [8],
            0 AS [9]

        UNION ALL

        SELECT
            S.[Row] + 1 AS [Row],
            (
                1 
                + iif(coalesce(M.[1], 0) = 1, 1, 0) * S.[ScratchcardCount] 
                + iif(coalesce(M.[2], 0) = 1, 1, 0) * S.[1]
                + iif(coalesce(M.[3], 0) = 1, 1, 0) * S.[2]
                + iif(coalesce(M.[4], 0) = 1, 1, 0) * S.[3]
                + iif(coalesce(M.[5], 0) = 1, 1, 0) * S.[4]
                + iif(coalesce(M.[6], 0) = 1, 1, 0) * S.[5]
                + iif(coalesce(M.[7], 0) = 1, 1, 0) * S.[6]
                + iif(coalesce(M.[8], 0) = 1, 1, 0) * S.[7]
                + iif(coalesce(M.[9], 0) = 1, 1, 0) * S.[8]
                + iif(coalesce(M.[10], 0) = 1, 1, 0) * S.[9]
            ),
            S.[ScratchcardCount],
            S.[1],
            S.[2],
            S.[3],
            S.[4],
            S.[5],
            S.[6],
            S.[7],
            S.[8]
        FROM
            scratchcard_counts S
            JOIN match_count_windows M ON (M.[Row] = S.[Row] + 1)
    ),
    part_1 AS (
        SELECT
            sum(iif(M.[MatchCount] = 0, 0, power(2, M.[MatchCount] - 1))) AS [Answer]
        FROM 
            match_counts M
    ),
    part_2 AS (
        SELECT
            sum(S.[ScratchcardCount]) AS [Answer]
        FROM
            scratchcard_counts S
        WHERE
            1 = 1
            AND (S.[Row] < ( SELECT count(*) FROM input ))
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2
OPTION
    ( MAXRECURSION 250 );