if (interactive()) {
  suppressMessages(require(devtools, quietly = T))
  suppressMessages(require(usethis, quietly = T))
  suppressMessages(require(fs, quietly = T))
  suppressMessages(require(ragg, quietly = T))
  suppressMessages(require(here, quietly = T))
}

## prevent scientific notation
options(
  scipen = 999,
  stringsAsFactors = FALSE,
  repos = c(
    CRAN = "https://cran.rstudio.org",
    INLA = "https://inla.r-inla-download.org/R/stable"
  ),
  browserNLdisabled = TRUE,
  warnPartialMatchDollar = TRUE,
  warnPartialMatchArgs = TRUE,
  warnPartialMatchAttr = TRUE,
  useFancyQuotes = FALSE,
  width = 120,
  ## default pkg develop
  usethis.full_name = "Niccolò Salvini",
  usethis.description = list(
    "Authors@R" = utils::person(
      "Niccolò", "Salvini",
      email = "niccolo.salvini27@gmail.com",
      role = c("aut", "cre")
    ),
    Version = "0.0.0.9000"
  ),
  usethis.destdir = "~/Desktop",
  usethis.overwrite = TRUE
)

f <- dplyr::filter

## fancy error printing
options(error = function() cat(" \\\ \n \\\
 /\\_/\\
 ( o.o )
 > ^ <\n\n"))
