WITH
    raw_input AS (
        SELECT
            L.[ordinal],
            L.[value]
        FROM 
            openrowset(BULK '/src/day.2.input.txt', SINGLE_CLOB) AS I
            CROSS APPLY string_split(I.[BulkColumn], CHAR(10), 1) AS L
        WHERE
            1 = 1
            AND (L.[value] <> '')
    ),
    parsed_input AS (
        SELECT
            cast(src.[GameId] AS int) AS [GameId],
            src.[SubsetId],
            sum(CASE WHEN src.[Color] = 'red' THEN src.[Count] ELSE 0 END) AS [Red],
            sum(CASE WHEN src.[Color] = 'green' THEN src.[Count] ELSE 0 END) AS [Green],
            sum(CASE WHEN src.[Color] = 'blue' THEN src.[Count] ELSE 0 END) AS [Blue]
        FROM (
            SELECT
                substring(I.[Value], 5, charindex(':', I.[Value]) - 5) AS [GameId],
                S.[ordinal] AS [SubsetId],
                right(trim(C.[value]), len(trim(C.[value])) - charindex(' ', trim(C.[value]))) AS [Color],
                left(trim(C.[value]), charindex(' ', trim(C.[value]))) AS [Count]
            FROM
                raw_input AS I
                CROSS APPLY string_split(substring(I.[Value], charindex(':', I.[Value]) + 2, len(I.[Value])), ';', 1) AS S
                CROSS APPLY string_split(S.[value], ',', 0) AS C
        ) AS src
        GROUP BY
            src.[GameId],
            src.[SubsetId]
    ),
    part_1 AS (
        SELECT
            sum(src.[GameId]) AS [Answer]
        FROM (
            SELECT
                I.[GameId],
                min(
                    CASE
                        WHEN (I.[Red] <= 12) AND (I.[Green] <= 13) AND (I.[Blue] <= 14) THEN 1
                        ELSE 0
                    END
                ) AS [IsPossible]
            FROM
                parsed_input AS I
            GROUP BY
                I.[GameId]
        ) AS src
        WHERE
            1 = 1
            AND (src.[IsPossible] = 1)
    ),
    part_2 AS (
        SELECT
            sum(src.[Power]) AS [Answer]
        FROM (
            SELECT
                I.[GameId],
                max(I.[Red]) * max(I.[Green]) * max(I.[Blue]) AS [Power]
            FROM
                parsed_input AS I
            GROUP BY
                I.[GameId]
        ) AS src
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2;