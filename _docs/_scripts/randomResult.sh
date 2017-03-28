number=$RANDOM
value=$(($number%2))
if (($value == 0)); then
  echo "Hello World"
else
  >&2 echo "error"
fi
