WITH
    N0 AS ( SELECT 1 AS [n] UNION ALL SELECT 1),                                               -- 2 rows
    N1 AS ( SELECT 1 AS [n] FROM N0 AS A, N0 AS B),                                            -- 4 rows
    N2 AS ( SELECT 1 AS [n] FROM N1 AS A, N1 AS B),                                            -- 16 rows
    N3 AS ( SELECT row_number() OVER ( ORDER BY (SELECT NULL) ) AS [n] FROM N2 AS A, N2 AS B), -- 256 rows
    input AS (
        SELECT
            L.[ordinal] AS [Row],
            N.[n] AS [Column],
            substring(L.[value], N.[n], 1) AS [Character]
        FROM 
            openrowset(BULK '/src/day.3.input.txt', SINGLE_CLOB) AS I
            CROSS APPLY string_split(I.[BulkColumn], CHAR(10), 1) AS L
            CROSS JOIN N3 AS N
        WHERE
            1 = 1
            AND (L.[value] <> '')
            AND (N.[n] <= 140)
    ),
    part_numbers AS (
        SELECT
            src.[Row],
            min(src.[Column]) AS [StartColumn],
            max(src.[Column]) AS [FinishColumn],
            cast(string_agg(src.[Character], '') AS int) AS [Value]
        FROM (
            SELECT
                I.*,
                iif(patindex('[0-9]', I.[Character]) = 0, 0, 1) AS [IsDigit],
                I.[Column] - row_number() OVER ( PARTITION BY I.[Row], iif(patindex('[0-9]', I.[Character]) = 0, 0, 1) ORDER BY I.[Column] ) AS [GroupNumber]
            FROM
                input I
        ) src
        WHERE
            1 = 1
            AND (src.[IsDigit] = 1)
        GROUP BY
            src.[Row],
            src.[IsDigit],
            src.[GroupNumber]
    ),
    symbols AS (
        SELECT
            *
        FROM
            input I
        WHERE
            1 = 1
            AND (patindex('[^0-9.]', I.[Character]) <> 0)
    ),
    part_1 AS (
        SELECT
            sum(P.[Value]) AS [Answer]
        FROM
            part_numbers P
        WHERE
            1 = 1
            AND (
                EXISTS ( 
                    SELECT
                        1
                    FROM
                        symbols S
                    WHERE 
                        1 = 1
                        AND (abs(S.[Row] - P.[Row]) <= 1)
                        AND (S.[Column] >= P.[StartColumn] - 1)
                        AND (S.[Column] <= P.[FinishColumn] + 1)
                )
            )
    ),
    part_2 AS (
        SELECT
            sum(src.[GearRatio]) AS [Answer]
        FROM (
            SELECT
                round(exp(sum(log(P.[Value]))), 0) AS [GearRatio]
            FROM
                symbols S,
                part_numbers P
            WHERE
                1 = 1
                AND (S.[Character] = '*')
                AND (abs(S.[Row] - P.[Row]) <= 1)
                AND (S.[Column] >= P.[StartColumn] - 1)
                AND (S.[Column] <= P.[FinishColumn] + 1)
            GROUP BY
                S.[Row],
                S.[Column]
            HAVING
                count(*) = 2
        ) src
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2;