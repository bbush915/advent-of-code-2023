WITH
    indices AS (
        SELECT
            src.[Type],
            src.[StartIndex]
        FROM (
            VALUES
                -- Winning Numbers
                ( 'W', 11 ), ( 'W', 14 ), ( 'W', 17 ), ( 'W', 20 ), ( 'W', 23 ), ( 'W', 26 ), ( 'W', 29 ), ( 'W', 32 ), ( 'W', 35 ), ( 'W', 38 ),
                -- My Numbers
                ( 'M', 43 ), ( 'M', 46 ), ( 'M', 49 ), ( 'M', 52 ), ( 'M', 55 ), ( 'M', 58 ), ( 'M', 61 ), ( 'M', 64 ), ( 'M', 67 ), ( 'M', 70 ), ( 'M', 73 ), ( 'M', 76 ), ( 'M', 79 ), ( 'M', 82 ), ( 'M', 85 ), ( 'M', 88 ), ( 'M', 91 ), ( 'M', 94 ), ( 'M', 97 ), ( 'M', 100 ), ( 'M', 103 ), ( 'M', 106 ), ( 'M', 109 ), ( 'M', 112 ), ( 'M', 115 )
        ) src ( [Type], [StartIndex] )
    ),
    input AS (
        SELECT
            L.[ordinal] AS [Row],
            IDX.[Type],
            cast(substring(L.[value], IDX.[StartIndex], 2) AS int) AS [Value]
        FROM 
            openrowset(BULK '/src/day.4.input.txt', SINGLE_CLOB) AS I
            CROSS APPLY string_split(I.[BulkColumn], CHAR(10), 1) AS L
            CROSS JOIN indices IDX
        WHERE
            1 = 1
            AND (L.[value] <> '')
    ),
    match_counts AS (
        SELECT
            S.[value] AS [Row],
            coalesce(src.[MatchCount], 0) AS [MatchCount]
        FROM 
            generate_series(1, 207, 1) S
        LEFT JOIN (
            SELECT
                I.[Row],
                count(*) AS [MatchCount]
            FROM
                input I
            WHERE
                1 = 1
                AND (I.[Type] = 'M')
                AND (
                    EXISTS (
                        SELECT
                            1
                        FROM
                            input
                        WHERE
                            1 = 1
                            AND ([Row] = I.[Row])
                            AND ([Type] = 'W')
                            AND ([Value] = I.[Value])
                    )
                )
            GROUP BY
                I.[Row]
        ) AS src ON (src.[Row] = S.[value])
    ),
    part_1 AS (
        SELECT
            sum(iif(M.[MatchCount] = 0, 0, power(2, M.[MatchCount] - 1))) AS [Answer]
        FROM 
            match_counts M
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
            1 AS [Count1],
            0 AS [Count2],
            0 AS [Count3],
            0 AS [Count4],
            0 AS [Count5],
            0 AS [Count6],
            0 AS [Count7],
            0 AS [Count8],
            0 AS [Count9],
            0 AS [Count10]

        UNION ALL

        SELECT
            S.[Row] + 1 AS [Row],
            (
                1 
                + iif(M.[1] = 1, 1, 0) * S.[Count1] 
                + iif(M.[2] = 1, 1, 0) * S.[Count2] 
                + iif(M.[3] = 1, 1, 0) * S.[Count3] 
                + iif(M.[4] = 1, 1, 0) * S.[Count4] 
                + iif(M.[5] = 1, 1, 0) * S.[Count5] 
                + iif(M.[6] = 1, 1, 0) * S.[Count6] 
                + iif(M.[7] = 1, 1, 0) * S.[Count7] 
                + iif(M.[8] = 1, 1, 0) * S.[Count8] 
                + iif(M.[9] = 1, 1, 0) * S.[Count9] 
                + iif(M.[10] = 1, 1, 0) * S.[Count10]
            ),
            S.[Count1],
            S.[Count2],
            S.[Count3],
            S.[Count4],
            S.[Count5],
            S.[Count6],
            S.[Count7],
            S.[Count8],
            S.[Count9]
        FROM
            scratchcard_counts S
            JOIN match_count_windows M ON (M.[Row] = S.[Row] + 1)
        WHERE
            1 = 1
            AND (S.[Row] < 207)
    ),
    part_2 AS (
        SELECT
            sum(S.[Count1]) AS [Answer]
        FROM
            scratchcard_counts S
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2
OPTION
    ( MAXRECURSION 250 );