WITH
    raw_input AS (
        SELECT
            L.[ordinal] AS [Row],
            L.[value] AS [Value]
        FROM 
            openrowset(BULK '/src/day.8.input.txt', SINGLE_CLOB) AS R
            CROSS APPLY string_split(R.[BulkColumn], CHAR(10), 1) AS L
        WHERE
            1 = 1
            AND (L.[value] <> '')
    ),
    instructions AS (
        SELECT
            (S.[value] - 1) AS [Index],
            substring(I.[Value], S.[value], 1) AS [Instruction]
        FROM
            raw_input I
            CROSS JOIN generate_series(1, 263, 1) S
        WHERE
            1 = 1
            AND (I.[Row] = 1)
    ),
    network AS (
        SELECT
            substring(I.[Value], 1, 3) AS [Label],
            substring(I.[Value], 8, 3) AS [Left],
            substring(I.[Value], 13, 3) AS [Right]
        FROM
            raw_input I
        WHERE
            1 = 1
            AND (I.[Row] > 1)
    ),
    part_1_navigation AS (
        SELECT
            cast('AAA' as varchar(max)) AS [Position],
            0 AS [Count]

        UNION ALL

        SELECT
            cast(
                CASE 
                    WHEN I.[Instruction] = 'L' THEN N.[Left]
                    ELSE N.[Right]
                END as varchar(max)
            ) AS [Position],
            (P.[Count] + 1) AS [Count]
        FROM
            part_1_navigation P
            JOIN instructions I ON (I.[Index] = (P.[Count] % 263))
            JOIN network N ON (N.[Label] = P.[Position])
        WHERE
            1 = 1
            AND (P.[Position] <> 'ZZZ')
    ),
    part_1 AS (
        SELECT 
            max([Count]) AS [Answer]
        FROM
            part_1_navigation
    ),
    part_2_navigation AS (
        SELECT
            row_number() OVER ( ORDER BY N.[Label] ) AS [Id],
            N.[Label] AS [Position],
            0 AS [Count]
        FROM
            network N
        WHERE
            1 = 1
            AND (right(N.[Label], 1) = 'A')

        UNION ALL

        SELECT
            P.[Id],
            cast(
                CASE 
                    WHEN I.[Instruction] = 'L' THEN N.[Left]
                    ELSE N.[Right]
                END as varchar(max)
            ) AS [Position],
            (P.[Count] + 1) AS [Count]
        FROM
            part_2_navigation P
            JOIN instructions I ON (I.[Index] = (P.[Count] % 263))
            JOIN network N ON (N.[Label] = P.[Position])
        WHERE
            1 = 1
            AND (right(P.[Position], 1) <> 'Z')
    ),
    periods AS (
        SELECT
            [Id],
            max([Count]) AS [Period]
        FROM
            part_2_navigation
        GROUP BY
            [Id]
    ),
    staggered_periods AS (
        SELECT
            P.[Id],
            P.[Period],
            coalesce(lead(P.[Period], 1) OVER ( ORDER BY P.[Id] ), 1) AS [NextPeriod]
        FROM
            periods P
    ),
    lcm AS (
        SELECT
            P.[Id],
            1 AS [A],
            P.[Period] AS [B],
            cast(P.[Period] as decimal(38)) AS [LCM]
        FROM
            staggered_periods P
        WHERE
            1 = 1
            AND (P.[Id] = 1)

        UNION ALL

        SELECT
            iif(L.[B] = 0, L.[ID] + 1, L.[ID]) AS [ID],
            iif(L.[B] = 0, iif(P.[Period] < P.[NextPeriod], P.[Period], P.[NextPeriod]), L.[B]),
            iif(L.[B] = 0, iif(P.[Period] < P.[NextPeriod], P.[NextPeriod], P.[Period]), L.[A] % L.[B]),
            iif(L.[B] = 0, L.[LCM] * P.[NextPeriod] / L.[A], L.[LCM])
        FROM
            lcm L
            JOIN staggered_periods P ON (P.[ID] = L.[ID])
        WHERE
            1 = 1
            AND (L.[Id] < 7)
    ),
    part_2 AS (
        SELECT
            L.[LCM] AS [Answer]
        FROM
            lcm L
        WHERE
            1 = 1
            AND (L.[Id] = 7)
    )
SELECT
    P1.[Answer] AS [Part1],
    P2.[Answer] AS [Part2]
FROM
    part_1 AS P1,
    part_2 AS P2
OPTION 
    ( MAXRECURSION 32767 );